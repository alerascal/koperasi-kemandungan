<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Deposit;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DepositController extends Controller
{
    public function index(Request $request)
    {
        $query = Deposit::with('user');

        if (auth()->user()->role !== 'admin') {
            $query->where('user_id', auth()->id());
        }

        $deposits = $query->latest()->paginate($request->per_page ?? 10);

        return response()->json($deposits);
    }

    public function show($id)
    {
        $query = Deposit::with('user');

        if (auth()->user()->role !== 'admin') {
            $query->where('user_id', auth()->id());
        }

        $deposit = $query->findOrFail($id);

        return response()->json($deposit);
    }

    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:100000',
            'period_months' => 'required|integer|in:3,6,12,24',
        ]);

        $interestRates = [
            3 => 5.0,
            6 => 6.0,
            12 => 7.5,
            24 => 9.0,
        ];

        $startDate = Carbon::now();
        $endDate = $startDate->copy()->addMonths($request->period_months);

        $deposit = Deposit::create([
            'user_id' => auth()->id(),
            'amount' => $request->amount,
            'interest_rate' => $interestRates[$request->period_months],
            'period_months' => $request->period_months,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => 'active',
        ]);

        $deposit->total_return = $deposit->calculateReturn();
        $deposit->save();

        return response()->json($deposit, 201);
    }

    public function cancel($id)
    {
        $deposit = Deposit::where('user_id', auth()->id())
            ->where('status', 'active')
            ->findOrFail($id);

        $deposit->update(['status' => 'cancelled']);

        return response()->json([
            'message' => 'Deposito berhasil dibatalkan',
            'deposit' => $deposit,
        ]);
    }
}