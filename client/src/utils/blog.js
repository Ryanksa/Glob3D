import { fetchGraphql } from './fetchService';

const createBlog = (title, content) => {
  return fetchGraphql(`
    query{
      getUserPosition
    }
  `)
  .then(({ data }) => {
    return fetchGraphql(`
      mutation {
        createBlog(title: "${title}", 
                  content: ${content},
                  position: [${data.getUserPosition[0]}, ${data.getUserPosition[1]}]) {
          _id
        }
      }
    `);
  });
};

export { createBlog };