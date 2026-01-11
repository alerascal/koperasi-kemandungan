<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Saving;
use App\Models\SavingTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SavingController extends Controller
{
    public function show()
    {
        $saving = Saving::firstOrCreate(
            ['user_id' => auth()->id()],
            ['balance' => 0]
        );

        return response()->json($saving->load('transactions'));
    }

    public function transactions(Request $request)
    {
        $saving = Saving::where('user_id', auth()->id())->firstOrFail();

        $transactions = $saving->transactions()
            ->latest()
            ->paginate($request->per_page ?? 10);

        return response()->json($transactions);
    }

    public function deposit(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:10000',
            'description' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $saving = Saving::firstOrCreate(
                ['user_id' => auth()->id()],
                ['balance' => 0]
            );

            $balanceBefore = $saving->balance;
            $balanceAfter = $balanceBefore + $request->amount;

            $saving->increment('balance', $request->amount);

            SavingTransaction::create([
                'saving_id' => $saving->id,
                'type' => 'deposit',
                'amount' => $request->amount,
                'description' => $request->description ?? 'Setoran tabungan',
                'balance_before' => $balanceBefore,
                'balance_after' => $balanceAfter,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Deposit berhasil',
                'saving' => $saving->fresh(),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function withdraw(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:10000',
            'description' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $saving = Saving::where('user_id', auth()->id())->firstOrFail();

            if ($saving->balance < $request->amount) {
                throw new \Exception('Saldo tidak mencukupi');
            }

            $balanceBefore = $saving->balance;
            $balanceAfter = $balanceBefore - $request->amount;

            $saving->decrement('balance', $request->amount);

            SavingTransaction::create([
                'saving_id' => $saving->id,
                'type' => 'withdrawal',
                'amount' => $request->amount,
                'description' => $request->description ?? 'Penarikan tabungan',
                'balance_before' => $balanceBefore,
                'balance_after' => $balanceAfter,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Penarikan berhasil',
                'saving' => $saving->fresh(),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
