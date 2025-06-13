const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const { amount, donationType } = JSON.parse(event.body);
    const priceIds = {
      unique: 'price_1RZbt4H28i0JUr05r1LhH9YB',
      monthly: 'price_1RZbwWH28i0JUr05zezFS27V',
      yearly: 'price_1RZbwWH28i0JUr05zezFS27V' // Fallback para mensal
    };
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto'],
      line_items: [{
        price: priceIds[donationType],
        quantity: 1,
        adjustable_quantity: { enabled: true, minimum: 1 }
      }],
      mode: donationType === 'unique' ? 'payment' : 'subscription',
      success_url: `${process.env.URL}/?success=true`,
      cancel_url: `${process.env.URL}/?canceled=true`,
      metadata: { purpose: 'church-renovation-phase2' }
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id })
    };
  } catch (error) {
    console.error('Erro:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao criar sessão de pagamento' })
    };
  }
};
