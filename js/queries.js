const getUserInfoQuery = `
{
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
      userActivity {
        date
        activity
      }
    }
  `;
