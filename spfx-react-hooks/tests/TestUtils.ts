export class TestUtils{
    public static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}