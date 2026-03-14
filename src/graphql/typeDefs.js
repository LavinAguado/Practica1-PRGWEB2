const typeDefs = `
  type Product {
    id: ID!
    title: String!
    price: Float!
    stock: Int!
  }

  type OrderProduct {
    product: Product!
    quantity: Int!
  }

  type Order {
   id: ID!
   user: User!
   products: [OrderProduct!]!
   total: Float!
   status: String!
   createdAt: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
  }

  input OrderItemInput {
    productId: ID!
    quantity: Int!
  }

  type Query {
    products: [Product!]!
    orders: [Order!]!
    ordersByStatus(status: String!): [Order!]!
    myOrders: [Order]
    users: [User!]!
  }

  type Mutation {
    createProduct(title: String!, price: Float!, stock: Int!): Product
    updateProduct(id: ID!, title: String, price: Float, stock: Int): Product
    deleteProduct(id: ID!): Boolean
    createOrder(items: [OrderItemInput!]!, userId: ID): Order
    updateOrderStatus(id: ID!, status: String!): Order!
    createUser(username: String!, email: String!, password: String!, role: String): User
    updateUser(id: ID!, username: String, email: String, role: String): User
    deleteUser(id: ID!): Boolean!
    changeUserRole(id: ID!, role: String!): User!
  }
`;

module.exports = typeDefs;
