import axios from "axios";

export const getDesign = async (designId: string) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/designs/${designId}`
  );
  return data;
};

export const updateDesign = async (
  designId: string,
  body: { data?: any; name?: string }
) => {
  const { data } = await axios.put(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/designs/${designId}`,
    body
  );
  return data;
};
