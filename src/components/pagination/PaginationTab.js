import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Image, List } from 'semantic-ui-react'

import ArrowLeftImage from '../../images/icon-arrow-left.svg'

import styled from 'styled-components'

const PaginationTabList = styled(List)`
   .ui.button {
      background: #f8f8f8;
      color: #0072ce;
      height: 36px;
      font-weight: 500;
      padding-left: 1em;
      padding-right: 1em;

      &.active {
         background: #999999;
         color: #ffffff;
      }

      :hover {
         background: #999999;
         color: #ffffff;
      }
   }

   .ui.image {
      width: 0.5em;
      padding-bottom: 0px;
   }
`

const LEFT_PAGE = 'LEFT'
const RIGHT_PAGE = 'RIGHT'

const range = (from, to, step = 1) => {
   let i = from
   const range = []

   while (i <= to) {
      range.push(i)
      i += step
   }

   return range
}

export class PaginationTab extends Component {
   static propTypes = {
      totalRecords: PropTypes.number.isRequired,
      pageLimit: PropTypes.number,
      pageNeighbors: PropTypes.number,
      onPageChanged: PropTypes.func,
      initialPage: PropTypes.number.isRequired
   }

   static defaultProps = {
      pageLimit: 10,
      pageNeighbors: 1,
      onPageChange: () => {},
      initialPage: 0
   }

   state = {
      currentPage: null
   }

   getTotalPages() {
      return Math.ceil(this.props.totalRecords / this.props.pageLimit)
   }

   componentDidMount() {
      this.setState({ currentPage: this.props.initialPage + 1 })
   }

   gotoPage = page => {
      const currentPage = this.props.onPageChanged(page) + 1
      this.setState({ currentPage })
   }

   handleClick = (page, evt) => {
      evt.preventDefault()
      this.gotoPage(page)
      evt.target.blur()
   }

   handleMoveLeft = evt => {
      evt.preventDefault()
      this.gotoPage(this.state.currentPage - this.props.pageNeighbors * 2 - 1)
      evt.target.blur()
   }

   handleMoveRight = evt => {
      evt.preventDefault()
      this.gotoPage(this.state.currentPage + this.props.pageNeighbors * 2 + 1)
      evt.target.blur()
   }

   fetchPageNumbers = () => {
      const totalPages = this.getTotalPages()
      const currentPage = this.state.currentPage
      const pageNeighbors = this.props.pageNeighbors

      const totalNumbers = pageNeighbors * 2 + 3
      const totalBlocks = totalNumbers + 2

      if (totalPages > totalBlocks) {
         let pages = []

         const leftBound = currentPage - pageNeighbors
         const rightBound = currentPage + pageNeighbors
         const beforeLastPage = totalPages - 1

         const startPage = leftBound > 2 ? leftBound : 2
         const endPage =
            rightBound < beforeLastPage ? rightBound : beforeLastPage

         pages = range(startPage, endPage)

         const pagesCount = pages.length
         const singleSpillOffset = totalNumbers - pagesCount - 1

         const leftSpill = startPage > 2
         const rightSpill = endPage < beforeLastPage

         const leftSpillPage = LEFT_PAGE
         const rightSpillPage = RIGHT_PAGE

         if (leftSpill && !rightSpill) {
            const extraPages = range(
               startPage - singleSpillOffset,
               startPage - 1
            )
            pages = [leftSpillPage, ...extraPages, ...pages]
         } else if (!leftSpill && rightSpill) {
            const extraPages = range(endPage + 1, endPage + singleSpillOffset)
            pages = [...pages, ...extraPages, rightSpillPage]
         } else if (leftSpill && rightSpill) {
            pages = [leftSpillPage, ...pages, rightSpillPage]
         }

         return [1, ...pages, totalPages]
      }

      return range(1, totalPages)
   }

   render() {
      if (!this.props.totalRecords) return null
      if (this.totalPages === 1) return null

      const pages = this.fetchPageNumbers()
      return (
         <PaginationTabList horizontal className='PaginationTab'>
            {pages.map((page, index) => {
               if (page === LEFT_PAGE)
                  return (
                     <List.Item key={index}>
                        <Button circular onClick={this.handleMoveLeft}>
                           <Image src={ArrowLeftImage} />
                        </Button>
                     </List.Item>
                  )

               if (page === RIGHT_PAGE)
                  return (
                     <List.Item key={index}>
                        <Button circular onClick={this.handleMoveRight}>
                           ...
                        </Button>
                     </List.Item>
                  )

               return (
                  <List.Item key={index}>
                     <Button
                        circular
                        active={this.state.currentPage === page}
                        onClick={e => this.handleClick(page, e)}
                     >
                        {page}
                     </Button>
                  </List.Item>
               )
            })}
         </PaginationTabList>
      )
   }
}
