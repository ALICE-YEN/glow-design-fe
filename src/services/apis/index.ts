import axiosInstance from "@/services/apis/axios";

export const createDesign = async (userId: number) => {
  const { data } = await axiosInstance.post("/designs", {
    name: "Untitled Design",
    description: "A new design plan",
    data: {},
    userId,
  });
  return data;
};

export const getDesign = async (designId: number) => {
  const { data } = await axiosInstance.get(`/designs/${designId}`);
  return data;
};

export const getDesignsByUser = async (userId: number) => {
  const { data } = await axiosInstance.get(`/designs/user/${userId}`);
  return data;
};

export const updateDesign = async (
  designId: number,
  body: { name?: string; description?: string; data?: any }
) => {
  const { data } = await axiosInstance.patch(`/designs/${designId}`, body);
  return data;
};

export const deleteDesign = async (designId: number) => {
  const { data } = await axiosInstance.delete(`/designs/${designId}`);
  return data;
};
