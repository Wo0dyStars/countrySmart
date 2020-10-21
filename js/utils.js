export const ajax = (params, callback, URL) => {
        
    $.ajax({
        url: URL,
        type: "POST",
        dataType: "json",
        data: params,
        success: callback,
        error: (error) => {
            console.log("The following error occurred: ", error);
        }
    })

}