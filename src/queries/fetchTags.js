import gql from 'graphql-tag'

export default gql`
  query fetchTags {
    allTags {
      id
      name
    }
  }
`