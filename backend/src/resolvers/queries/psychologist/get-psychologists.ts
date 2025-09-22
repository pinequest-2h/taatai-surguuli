import { User } from "@/models/User";
    
export const getPsychologists = async (
  _parent: unknown,
  _args: unknown,
  context: { userId?: string }
) => {
  try {
    const query: Record<string, unknown> = { role: "PSYCHOLOGIST" };
    
    // Filter out private profiles for non-authenticated users
    if (!context.userId) {
      query.isPrivate = { $ne: true };
    }
    
    const psychologists = await User.find(query)
      .select("-password")  
      .sort({ createdAt: -1 }); 
    
    return psychologists;
  } catch (error) {
    console.error("❌ GetPsychologists Error:", error);
    throw new Error("Failed to fetch psychologists");
  }
};

export const getPsychologistById = async (
  _parent: unknown, 
  { _id }: { _id: string },
  context: { userId?: string }
) => {
  try {
    const query: Record<string, unknown> = { 
      _id, 
      role: "PSYCHOLOGIST" 
    };
    

    if (!context.userId) {
      query.isPrivate = { $ne: true };
    }
    
    const psychologist = await User.findOne(query).select("-password");
    
    if (!psychologist) {
      throw new Error("Psychologist not found");
    }
    
    return psychologist;
  } catch (error) {
    console.error("❌ GetPsychologistById Error:", error);
    throw new Error("Failed to fetch psychologist");
  }
};

export const searchPsychologists = async (
  _parent: unknown, 
  { keyword }: { keyword: string },
  context: { userId?: string }
) => {
  try {
    const query: Record<string, unknown> = {
      role: "PSYCHOLOGIST",
      $or: [
        { fullName: { $regex: keyword, $options: "i" } },
        { userName: { $regex: keyword, $options: "i" } },
        { bio: { $regex: keyword, $options: "i" } }
      ]
    };
    
    // Filter out private profiles for non-authenticated users
    if (!context.userId) {
      query.isPrivate = { $ne: true };
    }
    
    const psychologists = await User.find(query)
      .select("-password")
      .sort({ fullName: 1 });
    
    return psychologists;
  } catch (error) {
    console.error("❌ SearchPsychologists Error:", error);
    throw new Error("Failed to search psychologists");
  }
};
