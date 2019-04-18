import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  
  * {
   box-sizing: inherit;
   }

   #root {
      min-height: 100vh;
   }
   html {
      box-sizing: border-box;
      min-height: 100vh;
      height: auto !important;

      body {
         margin: 0;
         padding: 0;
         min-height: 100vh !important;

         position: relative;
         color: #999;
         font-family: "benton-sans",sans-serif;
         font-weight: 400;
         font-size: 14px !important;
         

      }
   }

   
   
   .pusher {
      min-height: 100vh !important;
      ${'' /* padding-bottom: 200px; */}
   }

   .pushable {
      min-height: 100vh !important;
      ${'' /* margin-bottom: -200px; */}
   }


   .App {
      min-height: 100vh;
      ${'' /* padding-bottom: 200px; */}
   }
   .App > div {
      min-height: 100vh;
   }
   

   a {
      color: #0072ce;
   }
   a:hover {
      color: #0072ce;
      text-decoration: underline;
   }



   h1, .h1 {
      font-family: Bw Seido Round !important;
      font-size: 48px !important;
      font-weight: 500 !important;
      line-height: 100px;
      color: #4a4f54;
   }
   h2, .h2 {
      font-family: Bw Seido Round !important;
      font-size: 24px !important;
      font-weight: 500 !important;
      line-height: 1.33;
      color: #24272a !important;
      margin: 0px;
   }
   h3, .h3 {
      font-family: Bw Seido Round !important;
      font-size: 18px !important;
      font-weight: 500 !important;
      line-height: 24px !important;
      color: #24272a !important;
      margin: 0px;
   }
   h4, .h4 {
      font-family: Bw Seido Round !important;
      font-size: 16px;
      font-weight: 500;
      line-height: 1.33;
      color: #24272a;
      margin: 0px;
   }

   h5, .h5 {
      font-family: "benton-sans",sans-serif !important;
      font-size: 13px !important;
      line-height: 26px !important;
      font-weight: 500 !important;
      color: #999999;
      margin: 0px;
      letter-spacing: 1.8px;
   }

   h6, .h6 {
      font-family: "benton-sans",sans-serif !important;
      font-size: 12px !important;
      line-height: 18px !important;
      font-weight: 600 !important;
      color: #999999 !important;
      margin: 0px !important;
      letter-spacing: 1.5px !important;
   }



   .font-small {
      font-family: "benton-sans",sans-serif !important;
      font-size: 12px !important;
      color: #999 !important;
      font-weight: 400 !important;

      a {
         font-family: "benton-sans",sans-serif !important;
         font-size: 12px !important;
         color: #999 !important;
         font-weight: 500 !important;
      }

      a:hover {
         color: #999 !important;
      }
   }




   .bs-medium {
      font-weight: 500;
   }
   .font-bold {
      font-weight: 600;
   }


   .color-seafoam-blue {
      color: #6ad1e3 !important;
   }
   .color-blue {
      color: #0072ce !important;
   }
   .color-brown-grey {
      color: #999;
   }
   .color-charcoal-grey {
      color: #4a4f54;
   }
   .color-black {
      color: #24272a;

      :hover {
         color: #24272a;
      }
   }





   .border-bottom {
      border-bottom: 2px solid #f8f8f8 !important;
   }
   .border-bottom-bold {
      border-bottom: 4px solid #f8f8f8 !important;
   }
   .border-bottom-light {
      border-bottom: 1px solid #f8f8f8 !important;
   }

   .border-top {
      border-top: 2px solid #f8f8f8 !important;
   }

   .border-top-bold {
      border-top: 4px solid #f8f8f8 !important;
   }
   .border-top-light {
      border-top: 1px solid #f8f8f8 !important;
   }

   .border-left-bold {
      border-left: 4px solid #f8f8f8 !important;
   }


   .border-right {
      border-right: 2px solid #e6e6e6;
   }
   .border-right-light {
      border-right: 1px solid #e6e6e6;
   }
   .background-lg {
      background: #f8f8f8;
   }







   ${
      '' /* .button {
      font-family: "benton-sans",sans-serif !important;
      font-size: 14px !important;
   } */
   }


   


   .box {
      border: 4px solid #e6e6e6;
      border-radius: 8px;
      margin-bottom: 0px !important;
      position: relative;
      min-height: 100px;
      position: relative;

      

      .row {
         padding: 0px !important;
      }
      .column {
         padding: 24px 10px 20px 30px !important;
         word-wrap: break-word;
      }

      .segment {
         padding: 30px 0 20px 0 !important;
      }

      .list {

         > .item {
            padding: 0px !important;

            > img {
               top: -4px;
               margin: 0 10px;
            }

            > img.transarrow {
               width: 11px !important;
            }
         }
         > h5.item {
            top: -4px;
         }
      } 
   }



   .copy-image {
      width: 18px !important;
      margin: 0px 10px 0 0px !important;
      top: -4px !important;
   }



   .balance-image {
      font-size: 20px !important;
      font-weight: 100 !important;

      &-big {
         font-size: 32px !important;
         font-weight: 100 !important;
      }
   }
   


   .transactions-block .item {
      margin-left: 10px !important;
   }


   .page-title {
      ${'' /* padding-top: 20px !important; */}

      ${
         '' /* > .column {
         padding: 0px !important;
         margin: 0px !important;
      } */
      }
   }

   .icon-tiny {
      height: 12px !important;
      margin: 6px 6px 0 0;
      padding: 0px !important;
      float: left;
   }


   .hide {
      display: none !important;
   }


   .column-icon {
      width: 24px !important;
      display: inline-block !important;
      margin: -4px 10px 0 10px !important;
   }


   link.view-all, button.view-all, a.view-all {
      background: #6ad1e3 !important;
      margin: 0 !important;
      padding: 10px 20px !important;
      color: #fff !important;
      font-weight: 600 !important;
      border-radius: 20px !important;
      border: 2px solid #6ad1e3 !important;

      :hover {
         background: #fff !important;
         color: #6ad1e3 !important;
      }
   }
   




   .column-icon-s {
      width: 12px !important;
      display: inline-block !important;
      margin: -2px 10px 0 0;
   }

   .column-icon-r {
      width: 12px !important;
      display: inline-block !important;
      margin: 2px 0 0 10px;
   }


   .App-section {
      width: 860px;
      margin: auto;
      margin-top: 10px;
      margin-bottom: 20px;
   }

   .App-error-message {
      width: 100%;
      text-align: center;
      display: inline-block;
      margin: auto;
   }

   .block-element {
      padding-right: 0px !important;
   }

   












   @media screen and (max-width: 767px) {
      html {
         body {
            font-size: 12px !important;
         }
      }

      
      h1, .h1 {
         font-size: 36px !important;
         font-weight: 500;
         line-height: 50px;
         color: #4a4f54;
      }
      h2, .h2 {
         font-size: 16px !important;
         font-weight: 600;
         line-height: 1.33;
         margin: 0px;
      }
      h3, .h3 {
         font-size: 16px !important;
         font-weight: 500;
         line-height: 1.33;
         margin: 0px;
      }
      
      h6, .h6 {
         font-size: 10px !important;
         line-height: 18px !important;
         font-weight: 400 !important;
         margin: 0px !important;
         letter-spacing: 2px !important;
      }

      .box .column {
         padding: 16px 10px !important;
      }

      .recent-x .row {
         margin-left: 10px;
      }

      .create input {
         padding-left: 20px !important;
         font-size: 14px !important;
      }

      .dashboard-list .dropdown-image {
         display: none !important;
      }
      
      .dashboard-list .main-image {
         border: 1px solid #e6e6e6 !important;
         background: #fff;
         border-radius: 14px;
         padding: 6px;
         width: 26px !important;
      }

      .dashboard-recent-blocks {
         margin: 0 20px !important;
         padding: 0 0 0 10px !important;
      }
   }



   
`
