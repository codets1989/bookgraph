const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { Book , User, Category} = require('./models');
const { Op } = require('sequelize');
const category = require('./models/category');
const app = express();

// Define GraphQL Schema
const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
    year_published: Int!
    category: Category
  }
  type User {
    id: ID!
    username: String!
    fullname: String
    password: String!
  }
  type Category {
  id: ID!
  name: String!
  books: [Book!]!
  }  
  type Query {
    users: [User!]!
    book: [Book!]!
    user(id: ID!): User
    books(title: String, author: String, year_published: Int): [Book!]!
    categories: [Category!]!
  }

  type Mutation {
    createBook(title: String!, author: String!, year_published: Int!,categoryName:String!): Book
    createUser(username: String!, fullname: String, password: String!): User
    updateBook(id: ID!, title: String, author: String, year_published: Int): Book
    deleteBook(id: ID!): Boolean
    createCategory(name: String!): Category
  }
`;

// Define GraphQL Resolvers
const resolvers = {
  Query: {
    books: async (parent, { title, author, year_published }) => {
        const where = {};
        if (title) where.title = { [Op.like]: `%${title}%` };
        if (author) where.author = { [Op.like]: `%${author}%` };
        if (year_published) where.year_published = year_published;
        return await Book.findAll({ where ,include: [{ model: Category, as: 'category' }] });
      },
    users:async () => await User.findAll(),
    categories:async () => await Category.findAll(),
    book: async (parent, { id }) => await Book.findAll({include: [{ model: Category, as: 'category' }] }),
    user: async(parent,{id}) => await User.findByPk(id),
  },
  Mutation: {
    createBook: async (parent, { title, author, year_published ,categoryName}) => {
      let category = await Category.findOne({ where: { name: categoryName } });
      
        // If the category doesn't exist, create a new one
      if (!category) {
          category = await Category.create({ name: categoryName });
        }
      return await Book.create({ title, author, year_published ,categoryId: category.id });
    },
    createUser: async (parent, { username, fullname, password }) => {
        return await User.create({ username, fullname, password }); // Now correctly returns User
      },
    createCategory: async (parent, { name }) => {
        return await Category.create({ name }); // Now correctly returns User
      },  
    updateBook: async (parent, { id, title, author, year_published ,category }) => {
      const book = await Book.findByPk(id);
      return await book.update({ title, author, year_published ,category });
    },
    deleteBook: async (parent, { id }) => {
      const book = await Book.findByPk(id);
      await book.destroy();
      return true;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
});
