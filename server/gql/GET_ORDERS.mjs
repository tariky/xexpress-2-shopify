const query = `
    {
        orders(first: 100, query:"fulfillment_status:unfulfilled, status:open", reverse: true) {
        edges {
          node {
            note
            totalPriceSet {
              shopMoney {
                amount
              }
            }
            tags
            legacyResourceId
            displayFulfillmentStatus
            shippingAddress {
              address1
              city
              name
              phone
            }
            name
          }
          cursor
        }
      }
    }
    `;

export default query;
