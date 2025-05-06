const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

export const LoginUser = async (formData) => {
    try {
        console.log('backend_url :>> ', backend_url);
        const response = await fetch(`${backend_url}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        console.log("data", data);
        return data;
    } catch (error) {
        console.error('Error logging in:', error.message);
        throw error;
    }
}

export const RegisterUser = async (formData) => {
    try {
        const response = await fetch(`${backend_url}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        const data = await response.json();
        console.log("data", data);
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error registering:', error);
        throw error;
    }
}


export const LogoutUser = async () => {
    try {
        const response = await fetch(`${backend_url}/auth/logout`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        console.log(response);

        if (!response.ok) {
            throw new Error('Logout failed');
        }

        return true;
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
}

