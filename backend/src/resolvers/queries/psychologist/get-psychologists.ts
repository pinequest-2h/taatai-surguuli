import { User } from "@/models/User";
    
export const getPsychologists = async () => {
  try {
    const psychologists = await User.find({ role: "PSYCHOLOGIST" })
      .select("-password")  
      .sort({ createdAt: -1 }); 
    
    return psychologists;
  } catch (error) {
    console.error("❌ GetPsychologists Error:", error);
    throw new Error("Failed to fetch psychologists");
  }
};

export const getPsychologistById = async (_parent: unknown, { _id }: { _id: string }) => {
  try {
    const psychologist = await User.findOne({ 
      _id, 
      role: "PSYCHOLOGIST" 
    }).select("-password");
    
    if (!psychologist) {
      throw new Error("Psychologist not found");
    }
    
    return psychologist;
  } catch (error) {
    console.error("❌ GetPsychologistById Error:", error);
    throw new Error("Failed to fetch psychologist");
  }
};

export const searchPsychologists = async (_parent: unknown, { keyword }: { keyword: string }) => {
  try {
    const psychologists = await User.find({
      role: "PSYCHOLOGIST",
      $or: [
        { fullName: { $regex: keyword, $options: "i" } },
        { userName: { $regex: keyword, $options: "i" } },
        { bio: { $regex: keyword, $options: "i" } }
      ]
    })
    .select("-password")
    .sort({ fullName: 1 });
    
    return psychologists;
  } catch (error) {
    console.error("❌ SearchPsychologists Error:", error);
    throw new Error("Failed to search psychologists");
  }
};
