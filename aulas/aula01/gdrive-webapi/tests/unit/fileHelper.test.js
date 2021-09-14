import {
    describe,
    test,
    expect,
    jest,
} from '@jest/globals'
import fs from 'fs'
import FileHelper from '../../src/fileHelper.js'
import Routes from './../../src/routes.js'
describe('#FileHelper ', () => {
    describe('#getFileStatus', () => {
        test('it should return files statuses in correct format', async() => {
            const statMock = {
                dev: 2809746161,
                mode: 33206,
                nlink: 1,
                uid: 0,
                gid: 0,
                rdev: 0,
                blksize: 4096,
                ino: 108086391056892930,
                size: 101076,
                blocks: 200,
                atimeMs: 1631043564588.153,
                mtimeMs: 1626196345928.1853,
                ctimeMs: 1626196358626.5027,
                birthtimeMs: 1631043564072.1543,
                atime: '2021-09-14T13:29:04.738Z',
                mtime: '2021-09-14T13:29:04.738Z',
                ctime: '2021-09-14T13:29:04.738Z',
                birthtime: '2021-09-14T13:29:04.738Z'
            }

            const mockUser = 'Rubens'
            process.env.USER = mockUser
            const filename = 'rumos.png'
            jest.spyOn(fs.promises, fs.promises.readdir.name)
                .mockResolvedValue([filename])
            jest.spyOn(fs.promises, fs.promises.stat.name)
                .mockResolvedValue(statMock)
            const result = await FileHelper.getFilesStatus("/tmp")
            const expectedResult = [{
                size: "101 kB",
                lastModified: statMock.birthtime,
                owner: mockUser,
                file: filename
            }]
            expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${filename}`)
            expect(result).toMatchObject(expectedResult)
        })
    })
})