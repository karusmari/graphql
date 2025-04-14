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
    transaction_aggregate(
      where: {_and: [{type: {_eq: "xp"}}, {eventId: {_eq: 104}}]}
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }
  }`
