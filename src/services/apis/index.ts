import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const createDesign = async (userId: number) => {
  const { data } = await axios.post(
    `${BASE_URL}/designs`,
    {
      name: "Untitled Design",
      description: "A new design plan",
      data: {},
      userId,
    },
    { withCredentials: true }
  );
  return data;
};

export const getDesign = async (designId: number) => {
  const { data } = await axios.get(`${BASE_URL}/designs/${designId}`, {
    withCredentials: true,
  });
  return data;
};

export const getDesignsByUser = async (userId: number) => {
  const { data } = await axios.get(`${BASE_URL}/designs/user/${userId}`, {
    withCredentials: true,
  });
  return data;
};

export const updateDesign = async (
  designId: number,
  body: { name?: string; description?: string; data?: any }
) => {
  const { data } = await axios.patch(`${BASE_URL}/designs/${designId}`, body, {
    withCredentials: true,
  });
  return data;
};

export const deleteDesign = async (designId: number) => {
  const { data } = await axios.delete(`${BASE_URL}/designs/${designId}`, {
    withCredentials: true,
  });
  return data;
};
