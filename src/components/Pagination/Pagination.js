import React from 'react';

const Pagination = ({ totalRecords, currentPage, setCurrentPage }) => {
  const recordsPerPage = 10; // Number of records to display per page
  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <nav>
      <ul className='pagination justify-content-center'>
        <li className="page-item">
          <button className="page-link" onClick={goToPrevPage} disabled={currentPage === 1}>
            Previous
          </button>
        </li>
        {Array.from({ length: totalPages }).map((_, index) => (
          <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
            <button className='page-link' onClick={() => setCurrentPage(index + 1)}>
              {index + 1}
            </button>
          </li>
        ))}
        <li className="page-item">
          <button className="page-link" onClick={goToNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
