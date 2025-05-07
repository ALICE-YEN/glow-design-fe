import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const createDesign = async (userId: number) => {
  const { data } = await axios.post(`${BASE_URL}/designs`, {
    name: "Untitled Design",
    description: "A new design plan",
    data: {},
    userId,
  });
  return data;
};

export const getDesign = async (designId: number) => {
  const { data } = await axios.get(`${BASE_URL}/designs/${designId}`);
  return data;
};

export const getDesignsByUser = async (userId: number) => {
  const { data } = await axios.get(`${BASE_URL}/designs/user/${userId}`);
  return data;
};

export const updateDesign = async (
  designId: number,
  body: { name?: string; description?: string; data?: any }
) => {
  const { data } = await axios.patch(`${BASE_URL}/designs/${designId}`, body);
  return data;
};

export const deleteDesign = async (designId: number) => {
  const { data } = await axios.delete(`${BASE_URL}/designs/${designId}`);
  return data;
};
