import gql from 'graphql-tag'

export default gql`
  mutation updateUserBoards($id: ID!, $boards: [String!]!) {
    updateUser(id: $id, boards: $boards) {
      id,
      avatar,
      username,
      name,
      email,
      packages,
      boards
    }
  }
`;