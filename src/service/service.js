import axios from "axios"

const Url=process.env.BaseUrl;

export const loginadmin= async (email,password)=>{
    try{
        const response = await axios.post(`https://gfg.org.in/admin/loginadmin`,{
            emailId:email,
            password:password
        });
         
        return response.data;
    }catch(error){
        throw error
    }
}

export const getCustomer = async () => {
    try {
       const token = localStorage.getItem("token");
       const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
     const response = await axios.get(
        "https://gfg.org.in/user/getuserslist",
        config
      );
  
      return response.data;
    } catch (error) {
      throw error;
    }
  };


  export const getProducts = async () => {
    try {
      
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
   
      const response = await axios.get(
        "https://gfg.org.in/product/getproductslist",
        config
      );
  
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

  export const getMerchants=async ()=>{
    try{
        const token=localStorage.getItem("token");
        const config ={
            headers :{
                Authorization:`Bearer ${token}`
            }
        };
        const respone=await axios.get("https://gfg.org.in/user/getmerchantslist",config);
        return respone.data 

    }catch(error){
         throw error
    }
  }



  export const getMerchant = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get(
        "https://gfg.org.in/user/getmerchantslist",
        config
      );
      return {
        count: response.data.merchantsCount, // Get the count from the response
        data: response.data.data // Get the merchants data
      };
    } catch (error){
    
      throw error;
    }
  };


  export const getCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get(
        "https://gfg.org.in/user/getcustomerslist",
        config
      );
      return {
        count: response.data.customersCount, 
        data: response.data.data  
      };
    } catch (error) {
      
      throw error;
    }
  };
  
  
   export const addCustomer=async(customerData)=>{
    try{
    const response=await axios.post("https://gfg.org.in/user/customerregister",customerData)
       return response;

    }catch(error){
        
      throw error;
    }
   }

   
   export const delUser=async(userId)=>{
    try{
      const token=localStorage.getItem('token');
      const config={
        headers:{
          Authorization: `Bearer ${token}`
        }
      }
      const respone=await axios.post('https://gfg.org.in/user/deleteuser',userId,config)
      return respone.data;
    }catch(error){
      throw error;
    }
   }

   
   export const addMerchant= async(merchantdata)=>{
    try{
      const response=await axios.post('https://gfg.org.in/user/merchantregister',merchantdata)
      return response;
    }catch(error){
      throw error
    }
   }
  

   export const editCustomer= async(updateData)=>{
    try{
    const token =localStorage.getItem('token')
    console.log("token", token);
    const config={
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
    console.log("config", config);
    const response=await  axios.post('https://gfg.org.in/user/updateuser',updateData,config)
    return response;
    
    }catch(error){
      throw error
    }
   }

   export const  addProducts=async(formData)=>{
    try{
    const token=localStorage.getItem('token')
    const config={
      headers:{
        Authorization:`Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    }
    const response =await axios.post('https://gfg.org.in/product/addproduct',formData,config)
    return response.data
    }catch(error){
      throw error
    }
   }

   export const  editProducts=async(formData)=>{
    try{
    const token=localStorage.getItem('token')
    const config={
      headers:{
        Authorization:`Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    }
    const response =await axios.post('https://gfg.org.in/product/updateproduct',formData,config)
    return response;
    }catch(error){
      throw error
    }
   }


   export const viewProduct=async(productId)=>{
    try{
    const token=localStorage.getItem('token')
    const config={
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
    const response=await axios.post('https://gfg.org.in/product/getproductbyid',{ _id: productId },config)
    return response
    }catch(error){
      throw error
    }
   }

   export const delProduct=async(productId)=>{
    try{
        const token=localStorage.getItem('token')
        const config={
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
        const response=await axios.post('https://gfg.org.in/product/deleteproduct',productId,config)
        return response.data;
    }catch(error){
      throw error
    }
   }

   export const addAdvertisement=async(advertiseData)=>{
    try{
        const token=localStorage.getItem('token')
        const config={
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
        const response=await axios.post('https://gfg.org.in/advertisements/addadvertisement',advertiseData,config)
        return response.data;
    }catch(error){
      throw error
    }
  }

   export const getAdvertisements=async()=>{
    try{
        const token=localStorage.getItem('token')
        const config={
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
        const response=await axios.get('https://gfg.org.in/advertisements/getadvertisements',config)
        return response.data;
    }catch(error){
      throw error
    }
   }

   export const editAdvertisement=async(advertiseData)=>{
    try{
        const token=localStorage.getItem('token')
        const config={
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
        const response=await axios.post('https://gfg.org.in/advertisements/editadvertisement',advertiseData,config)
        return response.data;
    }catch(error){
      throw error
    }
  }

   export const deleteAdvertisement=async(id)=>{
    try{
        const token=localStorage.getItem('token')
        const config={
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
        const response=await axios.post('https://gfg.org.in/advertisements/deleteadvertisement',id,config)
        return response.data;
    }catch(error){
      throw error
    }
   }

   export const deleteFileFromServer = async (fileData) => {
    try {
      const token=localStorage.getItem('token')
        const config={
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      const response = await axios.post("https://gfg.org.in/advertisements/deleteadvertisementfile", fileData, config );
      return response.data;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  };

  export const merchantProducts = async (userId) => {
    try {
      // console.log("userIdProduct", userId);
      const token=localStorage.getItem('token')
        const config={
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      const response = await axios.post("https://gfg.org.in/product/getmerchantproducts", userId, config );
      return response.data;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  };

  export const getCategoriesList=async ()=>{
    try{
        const respone=await axios.get("https://gfg.org.in/product/getcatogerieslist",);
        return respone.data 

    }catch(error){
         throw error
    }
  }

  export const delCategory=async(categoryId)=>{
    try{
        const token=localStorage.getItem('token')
        const config={
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
        const response=await axios.post('https://gfg.org.in/product/deletecategory',categoryId,config)
        return response.data;
    }catch(error){
      throw error
    }
   }

   export const addCategory=async(categoryData)=>{
    try{
      const token=localStorage.getItem('token')
        const config={
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
    const response=await axios.post("https://gfg.org.in/product/addcategory",categoryData,config)
       return response;

    }catch(error){
        
      throw error;
    }
   }

   export const updateCategory=async(categoryData)=>{
    try{
      const token=localStorage.getItem('token')
        const config={
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
    const response=await axios.post("https://gfg.org.in/product/updatecategory",categoryData,config)
       return response;

    }catch(error){
        
      throw error;
    }
   }

   export const delMerchantProduct = async (_id) => {
    try {
      const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        
        const response = await axios.post(
          "https://gfg.org.in/product/deletemerchantproduct",
          _id,
          config
        );
    
        return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const editMerchantProduct = async (_id) => {
    try {
      const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        
        const response = await axios.post(
          "https://gfg.org.in/product/editmerchantproduct",
          _id,
          config
        );
    
        return response.data;
    } catch (error) {
      throw error;
    }
  };