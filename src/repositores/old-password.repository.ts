import {IOldPassword} from '../interfaces/old-password.interface';
import {FilterQuery} from 'mongoose';
import {OldPassword} from '../models/old-password.model';

class OldPasswordRepository {
    public async create(dto:IOldPassword): Promise<IOldPassword> {
        return await OldPassword.create(dto);
    }

    public async findByParams(userId:string): Promise<IOldPassword[]> {
        return await OldPassword.find({userId: userId});
    }

    public async deleteByParams(params: FilterQuery<IOldPassword>): Promise<number> {
        const result = await OldPassword.deleteMany(params);
        return result.deletedCount;
    }

}

export const oldPasswordRepository = new OldPasswordRepository();
