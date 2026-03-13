CREATE VIEW monthly_expense_report AS
WITH base_expenses AS (
  SELECT
    e.organization_id,
    date_trunc('month', e.date) AS month,
    e.category,
    e.status,
    e.amount,
    u.email
  FROM expenses e
  JOIN users u ON u.id = e.user_id
)

SELECT
  b.organization_id,
  b.month,

  (
    SELECT json_agg(t)
    FROM (
      SELECT category, SUM(amount) AS total_expenses
      FROM base_expenses b1
      WHERE b1.organization_id = b.organization_id
      AND b1.month = b.month
      GROUP BY category
    ) t
  ) AS total_expenses,

  (
    SELECT json_agg(t)
    FROM (
      SELECT email, SUM(amount) AS total_spent
      FROM base_expenses b2
      WHERE b2.organization_id = b.organization_id
      AND b2.month = b.month
      GROUP BY email
      ORDER BY total_spent DESC
      LIMIT 3
    ) t
  ) AS top_spenders,

  (
    SELECT json_build_object(
      'pending_count', COUNT(*) FILTER (WHERE status='SUBMITTED'),
      'approved_count', COUNT(*) FILTER (WHERE status='APPROVED'),
      'rejected_count', COUNT(*) FILTER (WHERE status='REJECTED')
    )
    FROM base_expenses b3
    WHERE b3.organization_id = b.organization_id
    AND b3.month = b.month
  ) AS status_counts

FROM base_expenses b
GROUP BY b.organization_id, b.month;