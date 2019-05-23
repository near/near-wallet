import React, { Fragment } from 'react'

const PaginationSummary = ({ pageNumber, pageLimit, totalRecords }) => (
   <Fragment>
      <span className='color-charcoal-grey'>
         {pageNumber * pageLimit + 1}-{(pageNumber + 1) * pageLimit}{' '}
      </span>
      OF {totalRecords} TOTAL
   </Fragment>
)

export default PaginationSummary
