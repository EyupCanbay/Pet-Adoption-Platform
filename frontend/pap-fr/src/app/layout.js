import React from 'react'
import "./globals.css"
function RootLayout({ children }) {
  return (
    <div>
      <html>
        <body>
          <main>{children}</main>
        </body>
      </html>
    </div>
  )
}

export default RootLayout