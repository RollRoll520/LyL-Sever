
class TestRecordController{
    async createTestRecord(ctx,next){

        await next();
    }

    async updateTestRecord(ctx,next){

        await next();
    }
    async findTestRecordByUid(ctx,next){
        await next();
    }
}

module.exports = new TestRecordController();