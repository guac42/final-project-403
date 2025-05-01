import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const search = req.nextUrl.searchParams.get('q') ?? '';

    const result = await query(
        `
        SELECT people.*, array_agg(primaryTitle) AS known_for, similarity(primaryName, $1) AS similarity
        FROM people
            JOIN known_for USING (personId)
            JOIN titles USING (titleId)
        WHERE primaryName % $1
        GROUP BY personId
        ORDER BY similarity DESC
        LIMIT 100
    `,
        [search]
    );

    return NextResponse.json(result.rows);
}