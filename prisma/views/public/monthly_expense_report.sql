WITH base_expenses AS (
  SELECT
    e.organization_id,
    date_trunc('month' :: text, e.date) AS MONTH,
    e.category,
    e.status,
    e.amount,
    u.email
  FROM
    (
      expenses e
      JOIN users u ON ((u.id = e.user_id))
    )
)
SELECT
  organization_id,
  MONTH,
  (
    SELECT
      json_agg(t.*) AS json_agg
    FROM
      (
        SELECT
          b1.category,
          sum(b1.amount) AS total_expenses
        FROM
          base_expenses b1
        WHERE
          (
            (b1.organization_id = b.organization_id)
            AND (b1.month = b.month)
          )
        GROUP BY
          b1.category
      ) t
  ) AS total_expenses,
  (
    SELECT
      json_agg(t.*) AS json_agg
    FROM
      (
        SELECT
          b2.email,
          sum(b2.amount) AS total_spent
        FROM
          base_expenses b2
        WHERE
          (
            (b2.organization_id = b.organization_id)
            AND (b2.month = b.month)
          )
        GROUP BY
          b2.email
        ORDER BY
          (sum(b2.amount)) DESC
        LIMIT
          3
      ) t
  ) AS top_spenders,
  (
    SELECT
      json_build_object(
        'pending_count',
        count(*) FILTER (
          WHERE
            (b3.status = 'SUBMITTED' :: "ExpenseStatus")
        ),
        'approved_count',
        count(*) FILTER (
          WHERE
            (b3.status = 'APPROVED' :: "ExpenseStatus")
        ),
        'rejected_count',
        count(*) FILTER (
          WHERE
            (b3.status = 'REJECTED' :: "ExpenseStatus")
        )
      ) AS json_build_object
    FROM
      base_expenses b3
    WHERE
      (
        (b3.organization_id = b.organization_id)
        AND (b3.month = b.month)
      )
  ) AS status_counts
FROM
  base_expenses b
GROUP BY
  organization_id,
  MONTH;