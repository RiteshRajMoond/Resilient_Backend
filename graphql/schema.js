const {gql} = require('graphql-tag');

const typeDefs = gql`
    type Task {
        id: ID!
        title: String!
        completed: Boolean!
    }

    type Query {
        getTasks: [Task]
    }
    
    type  Mutation {
        addTask(title: String!): Task
        updateTask(id: ID!, completed: Boolean!): Task
        deleteTask(id: ID!): String
    }
`;

module.exports = typeDefs;