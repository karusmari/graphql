const getUserInfoQuery = `
query {
  user {
    id
    firstName
    lastName
    login
    campus
    auditRatio
    totalUp
    totalDown
    xps {
      amount
      path
    }
    attrs
  }
}
`;
  
const xpQuery = `
  query {
    transaction(
      where: {type: {_eq: "xp"}}
      order_by: {createdAt: asc}
    ) {
      amount
      createdAt
      path
      type
    }
    transaction_aggregate(
      where: {
        _and: [
          {type: {_eq: "xp"}},
          {eventId: {_eq: 104}}
        ]
      }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }
  }`


const skillsQuery = `
query {
  user {
    skills: transactions(
      order_by: [{type: desc}, {amount: desc}]
      distinct_on: [type]
      where: {type: {_like: "skill%"}}
    ) {
      type
      amount
      createdAt
    }
  }
}`
