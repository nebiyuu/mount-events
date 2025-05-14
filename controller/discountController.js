// or wherever your pool is from
const { createDiscountSchema } = require('../validations/discountValidations')

exports.createDiscount = async (req, res) => {

  const { error } = createDiscountSchema.validate(req.body);
  if(error){
    return res.status(400).json({error: error.details[0].message });
  }

  const {
    code,
    discount_type,
    value,
    start_date,
    end_date,
    usage_limit,
    event_id,
    ticket_type_id
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO discount_codes (code, discount_type, value, start_date, end_date, usage_limit, event_id, ticket_type_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [code, discount_type, value, start_date, end_date, usage_limit, event_id, ticket_type_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create discount" });
  }
};
