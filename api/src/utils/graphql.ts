import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//GraphQL schema
const schema = buildSchema(`
  type Film {
    film_id: ID!
    title: String!
    description: String
    release_year: Int
    language_id: Int
    actors: [Actor!]!
  }

  type Actor {
    actor_id: ID!
    first_name: String!
    last_name: String!
    films: [Film!]!
  }

  type Query {
    films: [Film!]!
    film(film_id: ID!): Film
    actors: [Actor!]!
    actor(actor_id: ID!): Actor
  }
`);

// Example query to get a film with its actors
const exampleQuery = `
  query {
    film(film_id: 1) {
      film_id
      title
      description
      release_year
      language_id
      actors {
        actor_id
        first_name
        last_name
      }
    }
  }
`;

// Define resolvers using Prisma
const resolvers = {
  films: async () => {
    return await prisma.film.findMany();
  },
  film: async ({ film_id }: { film_id: string }) => {
    const film = await prisma.film.findUnique({
      where: { film_id: parseInt(film_id, 10) }, // Ensure it's an integer
      include: {
        film_actor: { include: { actor: true } },
      },
    });

    if (!film) {
      throw new Error(`Film with ID ${film_id} not found`);
    }

    return {
      ...film,
      actors: film.film_actor?.map((fa) => fa.actor) ?? [], // Ensure actors is an array
    };
  },
  actors: async () => {
    return await prisma.actor.findMany();
  },
  actor: async ({ actor_id }: { actor_id: string }) => {
    return await prisma.actor.findUnique({
      where: { actor_id: parseInt(actor_id, 10) },
      include: { film_actor: { include: { film: true } } },
    });
  },
  Film: {
    actors: async (parent: { film_id: number }) => {
      const filmWithActors = await prisma.film.findUnique({
        where: { film_id: parent.film_id },
        include: { film_actor: { include: { actor: true } } },
      });

      return filmWithActors?.film_actor.map((fa) => fa.actor) ?? []; // Return empty array instead of null
    },
  },
  Actor: {
    films: async (parent: { actor_id: number }) => {
      const actorWithFilms = await prisma.actor.findUnique({
        where: { actor_id: parent.actor_id },
        include: { film_actor: { include: { film: true } } },
      });

      return actorWithFilms?.film_actor.map((fa) => fa.film) ?? [];
    },
  },
};



// GraphQL handler
export function graphqlHandler(graphiql: boolean) {
  return graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql,
  });
}
