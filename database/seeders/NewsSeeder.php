<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\News;
use App\Models\User;
use Carbon\Carbon;

class NewsSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();

        $newsItems = [
            [
                'title' => 'Pembukaan Cabang Baru Koperasi',
                'slug' => 'pembukaan-cabang-baru-koperasi',
                'content' => 'Koperasi membuka cabang baru.',
                'excerpt' => 'Pembukaan cabang baru',
                'author_id' => $admin->id,
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(5),
            ],
        ];

        foreach ($newsItems as $news) {
            News::create($news);
        }
    }
}
