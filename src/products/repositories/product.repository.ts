import { IsPublic } from "src/common/enum/Identifier.enum";
import { EntityRepository, Repository } from "typeorm";
import { CreateProductDto } from "../dto/create-product.dto";
import { GetProductFilterDto } from "../dto/get-product-filter.dto";
import { Product } from "../entities/product.entity";

@EntityRepository(Product)
export class ProductRepository extends Repository<Product>{

    async getProductByIdAndIsPublic(filterDto: GetProductFilterDto): Promise<Product[]> {

        const query = this.createQueryBuilder('product')
        query.where('product.id =:id', { id: filterDto.id })
        if (filterDto.isPublished != -1)
            query.andWhere('product.isPublished =:ispublic', { ispublic: filterDto.isPublished })
        return await query.getMany();
    }

    async getProductById(id: number): Promise<Product> {
        return await this.findOne(id);
    }

    // async insertProduct(createProductDto: CreateProductDto, isPublic: IsPublic): Promise<Product> {

    // }

}