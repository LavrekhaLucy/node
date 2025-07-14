import { IUser } from '../interfaces/user.interface';
import { read, write } from '../services/fs.service';

class UserRepository {
    public async getList(): Promise<IUser[]> {
        return await read();
    }

    public async create(dto: Partial<IUser>): Promise<IUser> {
        const users = await read();

        const newUser = {
            id: users.length ? users[users.length - 1]?.id + 1 : 1,
            name: dto.name,
            age: dto.age,
            email: dto.email,
            phone: dto.phone,
        };
        users.push(newUser);
        await write(users);

        return newUser;
    }

    public async getById(userId: number): Promise<IUser | null> {
        const users = await read();
        return users.find((user) => user.id === userId);
    }



    public async updateById(userId: number, dto: Partial<IUser>): Promise<IUser | null> {
        const users = await read();
        const userIndex = users.findIndex(user => user.id === userId);

        if (userIndex === -1) throw new Error('User not found');

        users[userIndex] = {...users[userIndex], ...dto,};

        await write(users);
        return users[userIndex];
    }


    public async delete (userId: number): Promise<IUser> | null {

        const users = await read();
        const userIndex = users.findIndex((user) => user.id === userId);
        if (userIndex === -1) throw new Error ('User not found');

         users.splice(userIndex, 1);
        await write(users);

        return users[userIndex];

    }

}

export const userRepository = new UserRepository();