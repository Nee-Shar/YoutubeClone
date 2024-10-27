const asyncHandler = (reqesuetHandler) => {
  return (req, res, next) => {
    Promise.resolve(reqesuetHandler(req, res, next)).catch(next);
  };
};

export { asyncHandler };

// Higher order function is a funtion thath takes
// another function as an argument or returns a function
// as a result

// function salary(num){
//     return num*0.7;
// }

// setTimeout(salary,300) //it is high order function since it takes salary fun as input

// const mySalaries=[50,60,70,80,90,100];

// mySalaries.filter(n=> n> 50);   // filter is a high order function since it takes a function as input
