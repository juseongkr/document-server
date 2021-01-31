import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DocRepository } from './doc.repository';
import { DocsService } from './docs.service';
import { DocStatus } from './enum/doc-status.enum';

const mockUser = {
  id: 1,
  username: 'tester@email.com',
};

const mockDocRepository = () => ({
  findOne: jest.fn(),
  getDocs: jest.fn(),
  createDoc: jest.fn(),
  delete: jest.fn(),
});

describe('Docs Service', () => {
  let docsService;
  let docRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DocsService,
        {
          provide: DocRepository,
          useFactory: mockDocRepository,
        },
      ],
    }).compile();

    docsService = module.get<DocsService>(DocsService);
    docRepository = module.get<DocRepository>(DocRepository);
  });

  describe('getDocs test', () => {
    it('gets all docs from the repository', async () => {
      const mockValue = 'mock value';

      docRepository.getDocs.mockResolvedValue(mockValue);
      expect(docRepository.getDocs).not.toHaveBeenCalled();
      const filter = {
        search: 'search query',
        status: DocStatus.IN_PROGRESS,
      };

      const result = await docsService.getDocs(filter, mockUser);
      expect(docRepository.getDocs).toHaveBeenCalled();
      expect(result).toEqual(mockValue);
    });
  });

  describe('getDocById test', () => {
    it('calls docRepository.findOne() and return the doc', async () => {
      const mockDoc = {
        title: 'mock document',
        description: 'test desc',
        category: 'testing',
      };
      docRepository.findOne.mockResolvedValue(mockDoc);

      const result = await docsService.getDocById(1, mockUser);
      expect(result).toEqual(mockDoc);

      expect(docRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      });
    });

    it('throws an error as doc is not found', () => {
      docRepository.findOne.mockResolvedValue(null);
      expect(docsService.getDocById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createDoc test', () => {
    it('calls docRepository.createDoc() and return the result', async () => {
      const mockValue = 'mock value';

      docRepository.createDoc.mockResolvedValue(mockValue);
      expect(docRepository.createDoc).not.toHaveBeenCalled();

      const mockDoc = {
        title: 'mock document',
        description: 'test desc',
        category: 'testing',
      };

      const result = await docsService.createDoc(mockDoc, mockUser);
      expect(docRepository.createDoc).toHaveBeenCalledWith(mockDoc, mockUser);
      expect(result).toEqual(mockValue);
    });
  });

  describe('deleteDocById test', () => {
    it('calls docRepository.deleteDocById() to delete a doc', async () => {
      docRepository.delete.mockResolvedValue({ affected: 1 });
      expect(docRepository.delete).not.toHaveBeenCalled();

      await docsService.deleteDocById(1, mockUser);
      expect(docRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      });
    });

    it('throws an error as doc could not be found', () => {
      docRepository.delete.mockResolvedValue({ affected: 1 });

      expect(docsService.deleteDocById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateDocById test', () => {
    it('calls docRepository.updateDocById() to updates a doc information', async () => {
      const save = jest.fn().mockResolvedValue(true);

      docsService.getDocById = jest.fn().mockResolvedValue({
        description: 'test',
        save,
      });

      expect(docsService.getDocById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();

      const updateDocDto = { description: 'after test' };
      const result = await docsService.updateDocById(1, updateDocDto, mockUser);

      expect(docsService.getDocById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.description).toEqual('after test');
    });
  });
});
