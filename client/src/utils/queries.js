import { gql } from '@apollo/client'

export const QUERY_ME = gql`
    query me{
        me {
            _id
            username
            email
            savedBooks {
                authors
                description
                bookid
                image
                link
                title
            }
        }
    }
`; 