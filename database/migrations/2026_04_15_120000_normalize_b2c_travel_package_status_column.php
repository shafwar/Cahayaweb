<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'mysql' || $driver === 'mariadb') {
            DB::statement('UPDATE b2c_travel_packages SET status = LOWER(TRIM(status)) WHERE 1=1');
            DB::statement("UPDATE b2c_travel_packages SET status = 'closed' WHERE status NOT IN ('open','closed')");
        } else {
            foreach (DB::table('b2c_travel_packages')->select('id', 'status')->cursor() as $row) {
                $s = strtolower(trim((string) $row->status));
                if ($s === 'open') {
                    DB::table('b2c_travel_packages')->where('id', $row->id)->update(['status' => 'open']);
                } else {
                    DB::table('b2c_travel_packages')->where('id', $row->id)->update(['status' => 'closed']);
                }
            }
        }
    }

    public function down(): void
    {
        // Irreversible data normalization
    }
};
