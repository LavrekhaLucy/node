import {IUser, IUserListQuery} from '../interfaces/user.interface';
import {User} from '../models/user.model';
import {Token} from '../models/token.model';
import {FilterQuery} from 'mongoose';

class UserRepository {
       public async getList(query: IUserListQuery): Promise<[IUser[], number]> {
        const filterObj: FilterQuery<IUser> = {'isVerified': false};
        if (query.search) {
            filterObj.name = { $regex: query.search, $options: 'i' };
            // filterObj.$or = [
            //   { name: { $regex: query.search, $options: "i" } },
            //   { email: { $regex: query.search, $options: "i" } },
            // ];
        }
           const sort: Record<string, 1 | -1> = {};
               if (query.orderBy && query.order) {
                   sort[query.orderBy] = query.order === 'asc' ? 1 : -1;
               }

        const skip = query.limit * (query.page - 1);
        const [entities, count] = await Promise.all([
                User.find(filterObj).sort(sort).limit(query.limit).skip(skip),
                User.countDocuments(filterObj),
            ]);
              return [entities, count];
    }

    public async create(dto: Partial<IUser>): Promise<IUser> {
       return  await User.create(dto);
    }

    public async getById(userId: string): Promise<IUser | null> {
        return await User.findById(userId).select('+password');
    }


    public async getByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email }).select('+password');
    }


    public async updateById(userId: string, dto: Partial<IUser>): Promise<IUser> {
        return await User.findByIdAndUpdate(userId,dto,{new:true});
    }


    public async deleteById (userId: string): Promise<void>  {
await  User.deleteOne({_id: userId});
    }

    public async findWithOutActivity(date: Date): Promise<IUser[]> {
        return await User.aggregate([
            {
                $lookup: {
                    from: Token.collection.name,
                    let: { userId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_userId', '$$userId'] } } },
                        { $match: { createdAt: { $gt: date } } },
                    ],
                    as: 'tokens',
                },
            },
            { $match: { tokens: { $size: 0 } } },
        ]);
    }

}


export const userRepository = new UserRepository();