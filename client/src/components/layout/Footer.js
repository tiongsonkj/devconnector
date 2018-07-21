import React from 'react';

// can put in javascript and JS functions in between { }. look at line 7
export default () => {
  return (
    <footer className="bg-dark text-white mt-5 p-4 text-center">
        Copyright &copy; {new Date().getFullYear()} DevConnector
    </footer>
  )
}
