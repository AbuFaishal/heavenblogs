import React from 'react'
function Pagination({ totalpage, postperpage, paginate, currentpage, maxpage, minpage, prevBut, nextBut }) {//we can also use single variable props

    let pagenumbers = [];
    for (let i = 1; i <= Math.ceil(totalpage / postperpage); i++) {
        pagenumbers.push(i);
    }
    //storing maximum page generates
    let maxnum = pagenumbers.length;
    // console.log(minpage, maxpage);
    return (
        <>
            {/* <!-- pagination --> */}
            <nav className="pagination" aria-label="...">
                <ul className="pagination">
                    {//if current page number become 1 prev button will be invisible
                        currentpage > 1 ?
                            <li className="page-item" onClick={() => { prevBut() }}>
                                <a className="page-link" href="#">Previous</a>
                            </li>
                            : null}
                    {
                        pagenumbers.map((number) => {
                            if (number < maxpage + 1 && number > minpage) {
                                return (
                                    <>
                                        <li className={currentpage==number?"page-item active":"page-item"} key={number} onClick={() => paginate(number)}><a className="page-link" href="#" >{number}</a></li>
                                    </>
                                )
                            }
                            else {
                                return null;
                            }
                        })
                        //here passing maximum number of page generates in button on click
                        //and when current page number exceed next button will be invisible
                    }
                    {currentpage < maxnum ?
                        <li className="page-item" onClick={() => { nextBut(maxnum) }}>
                            <a className="page-link" href="#">Next</a>
                        </li>
                        : null}
                </ul>
            </nav>
        </>
    )
}

export default Pagination
