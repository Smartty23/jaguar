const db = require('../models');
const Users = db.users;

const Categories = db.categories;

const CoffeeBlends = db.coffee_blends;

const Customers = db.customers;

const Orders = db.orders;

const Payments = db.payments;

const Reports = db.reports;

const CategoriesData = [
  {
    name: 'Hans Bethe',
  },

  {
    name: 'Robert Koch',
  },

  {
    name: 'Edward O. Wilson',
  },
];

const CoffeeBlendsData = [
  {
    name: 'Alfred Binet',

    price: 98.13,

    stock_level: 5,

    // type code here for "relation_one" field
  },

  {
    name: 'Edwin Hubble',

    price: 58.19,

    stock_level: 4,

    // type code here for "relation_one" field
  },

  {
    name: 'Paul Ehrlich',

    price: 52.52,

    stock_level: 6,

    // type code here for "relation_one" field
  },
];

const CustomersData = [
  {
    name: 'Francis Crick',

    email: 'valentin@reynolds.biz',

    taste_preferences: 'Use your feelings, Obi-Wan, and find him you will.',
  },

  {
    name: 'Lynn Margulis',

    email: 'ken_prosacco@heathcote-hand.org',

    taste_preferences:
      'Size matters not. Look at me. Judge me by my size, do you? Hmm? Hmm. And well you should not. For my ally is the Force, and a powerful ally it is. Life creates it, makes it grow. Its energy surrounds us and binds us. Luminous beings are we, not this crude matter. You must feel the Force around you; here, between you, me, the tree, the rock, everywhere, yes. Even between the land and the ship.',
  },

  {
    name: 'Lucretius',

    email: 'fernanda.deckow@corkery.name',

    taste_preferences:
      'Soon will I rest, yes, forever sleep. Earned it I have. Twilight is upon me, soon night must fall.',
  },
];

const OrdersData = [
  {
    // type code here for "relation_one" field

    // type code here for "relation_many" field

    order_date: new Date('2023-07-11'),

    grind_choice: 'Standby',

    shipping_tracking: 'Standby',
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_many" field

    order_date: new Date('2024-05-25'),

    grind_choice: 'Like a red-headed stepchild',

    shipping_tracking: 'I tell you what',
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_many" field

    order_date: new Date('2023-06-17'),

    grind_choice: 'So I was walking Oscar',

    shipping_tracking: "It's around here somewhere",
  },
];

const PaymentsData = [
  {
    // type code here for "relation_one" field

    amount: 80.31,

    transaction_id: 'So I was walking Oscar',

    verified: true,
  },

  {
    // type code here for "relation_one" field

    amount: 96.18,

    transaction_id: "It's around here somewhere",

    verified: false,
  },

  {
    // type code here for "relation_one" field

    amount: 13.49,

    transaction_id: "Y'all never listen to me",

    verified: true,
  },
];

const ReportsData = [
  {
    generated_at: new Date('2023-09-07'),

    report_type: 'Might be DQ time',

    // type code here for "files" field
  },

  {
    generated_at: new Date('2024-03-26'),

    report_type: 'Like a red-headed stepchild',

    // type code here for "files" field
  },

  {
    generated_at: new Date('2024-01-23'),

    report_type: 'My buddy Harlen',

    // type code here for "files" field
  },
];

// Similar logic for "relation_many"

async function associateCoffeeBlendWithCategory() {
  const relatedCategory0 = await Categories.findOne({
    offset: Math.floor(Math.random() * (await Categories.count())),
  });
  const CoffeeBlend0 = await CoffeeBlends.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (CoffeeBlend0?.setCategory) {
    await CoffeeBlend0.setCategory(relatedCategory0);
  }

  const relatedCategory1 = await Categories.findOne({
    offset: Math.floor(Math.random() * (await Categories.count())),
  });
  const CoffeeBlend1 = await CoffeeBlends.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (CoffeeBlend1?.setCategory) {
    await CoffeeBlend1.setCategory(relatedCategory1);
  }

  const relatedCategory2 = await Categories.findOne({
    offset: Math.floor(Math.random() * (await Categories.count())),
  });
  const CoffeeBlend2 = await CoffeeBlends.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (CoffeeBlend2?.setCategory) {
    await CoffeeBlend2.setCategory(relatedCategory2);
  }
}

async function associateOrderWithCustomer() {
  const relatedCustomer0 = await Customers.findOne({
    offset: Math.floor(Math.random() * (await Customers.count())),
  });
  const Order0 = await Orders.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Order0?.setCustomer) {
    await Order0.setCustomer(relatedCustomer0);
  }

  const relatedCustomer1 = await Customers.findOne({
    offset: Math.floor(Math.random() * (await Customers.count())),
  });
  const Order1 = await Orders.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Order1?.setCustomer) {
    await Order1.setCustomer(relatedCustomer1);
  }

  const relatedCustomer2 = await Customers.findOne({
    offset: Math.floor(Math.random() * (await Customers.count())),
  });
  const Order2 = await Orders.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Order2?.setCustomer) {
    await Order2.setCustomer(relatedCustomer2);
  }
}

// Similar logic for "relation_many"

async function associatePaymentWithOrder() {
  const relatedOrder0 = await Orders.findOne({
    offset: Math.floor(Math.random() * (await Orders.count())),
  });
  const Payment0 = await Payments.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Payment0?.setOrder) {
    await Payment0.setOrder(relatedOrder0);
  }

  const relatedOrder1 = await Orders.findOne({
    offset: Math.floor(Math.random() * (await Orders.count())),
  });
  const Payment1 = await Payments.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Payment1?.setOrder) {
    await Payment1.setOrder(relatedOrder1);
  }

  const relatedOrder2 = await Orders.findOne({
    offset: Math.floor(Math.random() * (await Orders.count())),
  });
  const Payment2 = await Payments.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Payment2?.setOrder) {
    await Payment2.setOrder(relatedOrder2);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Categories.bulkCreate(CategoriesData);

    await CoffeeBlends.bulkCreate(CoffeeBlendsData);

    await Customers.bulkCreate(CustomersData);

    await Orders.bulkCreate(OrdersData);

    await Payments.bulkCreate(PaymentsData);

    await Reports.bulkCreate(ReportsData);

    await Promise.all([
      // Similar logic for "relation_many"

      await associateCoffeeBlendWithCategory(),

      await associateOrderWithCustomer(),

      // Similar logic for "relation_many"

      await associatePaymentWithOrder(),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('categories', null, {});

    await queryInterface.bulkDelete('coffee_blends', null, {});

    await queryInterface.bulkDelete('customers', null, {});

    await queryInterface.bulkDelete('orders', null, {});

    await queryInterface.bulkDelete('payments', null, {});

    await queryInterface.bulkDelete('reports', null, {});
  },
};
