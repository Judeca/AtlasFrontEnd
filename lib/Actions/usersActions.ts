"use server";

export async function createUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
  profilePicture: string;
}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/admin-createUser` , {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to create user");
  }

  return await res.json();
}

//Fetch All Users with filters

export async function fetchUsers(page: number = 1, limit: number = 5) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/shared-getallUser`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Accept: "application/json"
      },
      body: JSON.stringify({
        pagination: { page, limit },
        filters: {} 
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await res.json();
    
    // Return the exact structure the client expects
    return {
      data: data.data || data.users || data || [],
      meta: data.meta || {
        currentPage: page,
        totalPages: Math.ceil((data.meta?.totalItems || data.data?.length || 0) / limit),
        totalItems: data.meta?.totalItems || data.data?.length || 0,
        itemsPerPage: limit
      }
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      data: [],
      meta: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: limit
      }
    };
  }
}

//fetc users without filters
export async function fetchUsersnofilter(page: number = 1) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/shared-getallUsernofilter`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Accept: "application/json"
      },
      cache: "no-store",
    });
   

    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await res.json();
    
    // Handle different possible response structures
    if (Array.isArray(data)) {
      return data; // If API returns array directly
    } else if (data.users && Array.isArray(data.users)) {
      return data.users; // If API returns { users: [...] }
    } else if (data.data && Array.isArray(data.data)) {
      return data.data; // If API returns { data: [...] }
    } else {
      throw new Error("Unexpected API response format");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return []; // Return empty array as fallback
  }
}


//update user Role

export async function updateUserRole(userId: string, newRole: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/admin-updateUserrole/${userId}`, {
    method: "PUT", 
    headers: {
      "Content-Type": "application/json",
      Accept:"application/json"
    },
    body: JSON.stringify({ role: newRole }),
  });

 { /* if (!res.ok) {
    throw new Error("Failed to update user role");
  } */}

  return await res.json();
}


export async function deleteUser(userId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/admin-deleteUser/${userId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete user");
    }

    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to delete user" 
    };
  }
}

