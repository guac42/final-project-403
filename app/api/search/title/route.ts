import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const search = req.nextUrl.searchParams.get('q') ?? '';

    const result = await query(
        `
        SELECT *, similarity(primaryTitle, $1) AS similarity
        FROM titles
        WHERE primaryTitle % $1
        ORDER BY similarity DESC, numVotes DESC
        LIMIT 100
    `,
        [search]
    );

    return NextResponse.json(result.rows);
}