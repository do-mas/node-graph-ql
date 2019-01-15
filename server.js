var express = require('express');
var express_graphql = require('express-graphql');
const cors = require('cors');
var {buildSchema} = require('graphql');
var faker = require('faker');


// STUB DATA
var authors = [];
for (let index = 0; index < 10; index++) {
    authors.push(
        {
            id: index + 1,
            name: faker.name.findName(),
            year: new Date(faker.date.between('1988', '1991')).getFullYear()
        }
    );
}

// QUERY METHODS
var getAuthor = function (args) {
    var id = args.id;
    return authors.filter(author => {
        return author.id == id;
    })[0];
};
var getAuthors = function (args) {
    let authorsResponse = authors;
    if (args.name) {
        const name = args.name;
        authorsResponse = authorsResponse.filter(author => author.name === name);
    }
    if (args.year) {
        const year = args.year;
        authorsResponse = authorsResponse.filter(author => author.year === year);
    }
    return authorsResponse;
};

// GraphQL APP CONFIG
var app = express();
app.use(cors());
app.use('/graphql', express_graphql({
    schema: buildSchema(`
        type Query {
            author(id: Int!): Author
            authors(name: String, year: Int): [Author]
        },
        type Author {
            id: Int
            name: String
            year: Int
        }
    `),
    rootValue: {
        author: getAuthor,
        authors: getAuthors
    },
    graphiql: true

}));

app.listen(4000, () => console.log('GraphQL running on localhost:4000/graphql'));
