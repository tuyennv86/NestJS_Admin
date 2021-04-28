import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryType, IsPublic } from 'src/common/enum/Identifier.enum';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(CategoryRepository)
        private categoryRepository: CategoryRepository
    ) { }

    async getByCategoryId(id: number): Promise<Category> {
        const found = await this.categoryRepository.findOne(id);
        if (!found) {
            throw new NotFoundException(`Không tìm thấy id ${id} của bạn`)
        }
        return found;
    }

    async getByRootCategory(): Promise<Category[]> {
        return await this.categoryRepository.findRoots();
    }

    async getAllByTreeCategory(): Promise<Category[]> {
        return await this.categoryRepository.findTrees();
    }
    async getChildrenNext(idParent: number): Promise<Category[]> {
        return await this.categoryRepository.getChildrenNext(idParent);
    }
    async getChildrenNextTree(idParent: number): Promise<Category> {
        return await this.categoryRepository.getChildrenNextTree(idParent);
    }
    async getParent(id: number): Promise<Category[]> {
        return await this.categoryRepository.getParent(id);
    }
    async getParentTree(id: number): Promise<Category> {
        return await this.categoryRepository.getParentTree(id);
    }
    async createCategory(createCategoryDto: CreateCategoryDto, isPublic: IsPublic, typeCode: CategoryType): Promise<Category> {
        return await this.categoryRepository.createCategory(createCategoryDto, isPublic, typeCode);
    }

    async updateCategory(id: number, createCategoryDto: CreateCategoryDto, isPublic: IsPublic, typeCode: CategoryType): Promise<Category> {
        return await this.categoryRepository.updateCategory(id, createCategoryDto, isPublic, typeCode);
    }

    async deleteCategory(id: number): Promise<void> {
        return await this.categoryRepository.deleteCategory(id);
    }

}
