import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const search = req.nextUrl.searchParams.get('q') ?? '';

    const result = await query(
        `
            WITH known_for_sum AS (
                SELECT personId, sum(numVotes) AS sum
                FROM known_for
                    JOIN titles USING (titleId)
                    JOIN principals USING (titleId, personId)
                WHERE "category" BETWEEN 'self'::principal_category AND 'actress'::principal_category
                GROUP BY personId
            )
            SELECT titles.*, array_agg(primaryName) AS stars
            FROM (
                SELECT titleId, primaryName, similarity(primaryTitle, $1) AS similarity
                FROM (
                    SELECT
                        ROW_NUMBER() OVER (PARTITION BY titleId ORDER BY sum DESC) AS r,
                        titleId, primaryTitle, primaryName
                    FROM (
                        SELECT *
                        FROM titles
                        WHERE primaryTitle % $1
                        LIMIT 100
                    )
                        JOIN known_for USING (titleId)
                        JOIN known_for_sum USING (personId)
                        JOIN people USING (personId)
                ) j
                WHERE j.r <= 3
            )
                JOIN titles USING (titleId)
            GROUP BY titles.titleId, similarity
            ORDER BY similarity DESC, numVotes DESC
    `,
        [search]
    );

    return NextResponse.json(result.rows);
}