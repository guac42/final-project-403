import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const search = req.nextUrl.searchParams.get('q') ?? '';

    const result = await query(
        `
        SELECT *, similarity(primaryName, $1) AS similarity
        FROM people
        WHERE primaryName % $1
        ORDER BY similarity DESC
        LIMIT 100
    `,
        [search]
    );

    return NextResponse.json(result.rows);
}