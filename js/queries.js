const getUserInfoQuery = `
query {
  user {
    id
    firstName
    lastName
    login
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
    limit: 1000
  ) {
    amount
    createdAt
    path
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
