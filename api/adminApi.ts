import { Endpoint } from "./endpoint";
import adminAxios from "./adminIntercepter";

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISubcategory {
  _id: string;
  name: string;
  slug: string;
  category: string | { _id: string; name: string; slug: string };
  createdAt: string;
  updatedAt: string;
}

/* =====================================================
   ADMIN AUTH
===================================================== */

export const adminLogin = async (email: string, password: string) => {
  const { data } = await adminAxios.post(Endpoint.adminLogin, {
    email,
    password,
  });
  return data;
};

/* =====================================================
   CATEGORY APIs
===================================================== */

export const getCategories = async () => {
  const { data } = await adminAxios.get(Endpoint.getCategories);
  return data;
};

export const createCategory = async (name: string) => {
  const { data } = await adminAxios.post(Endpoint.createCategory, { name });
  return data;
};

export const deleteCategory = async (id: string) => {
  const { data } = await adminAxios.delete(Endpoint.deleteCategory(id));
  return data;
};

/* =====================================================
   SUBCATEGORY APIs
===================================================== */

export const getSubcategories = async (categoryId?: string) => {
  const { data } = await adminAxios.get(Endpoint.getSubcategories, {
    params: categoryId ? { category: categoryId } : undefined,
  });
  return data;
};

export const createSubcategories = async (category: string, names: string[]) => {
  const { data } = await adminAxios.post(Endpoint.createSubcategories, {
    category,
    names,
  });
  return data;
};

export const deleteSubcategory = async (id: string) => {
  const { data } = await adminAxios.delete(Endpoint.deleteSubcategory(id));
  return data;
};
